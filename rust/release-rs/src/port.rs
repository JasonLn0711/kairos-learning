#![forbid(unsafe_code)]

use html5ever::tendril::StrTendril;
use html5ever::tokenizer::states::{RawKind::Rawtext, RawKind::Rcdata};
use html5ever::tokenizer::{
    BufferQueue, TagKind::StartTag, Token, TokenSink, TokenSinkResult, Tokenizer,
};
use pyo3::prelude::*;
use serde_json::{Map, Value, json};
use std::cell::{Cell, RefCell};
use std::collections::BTreeSet;

#[derive(Default)]
struct Metadata {
    ids: BTreeSet<String>,
    duplicates: BTreeSet<String>,
    links: Vec<String>,
    lang: String,
    canonical: String,
    headings: usize,
    alternates: Map<String, Value>,
    scripts: Vec<String>,
    csp: String,
}

#[derive(Default)]
struct Page(RefCell<Metadata>, Cell<bool>);

impl TokenSink for Page {
    type Handle = ();

    fn process_token(&self, token: Token, _: u64) -> TokenSinkResult<()> {
        let Token::TagToken(tag) = token else {
            if matches!(token, Token::ParseError(_)) {
                self.1.set(true);
            }
            return TokenSinkResult::Continue;
        };
        if tag.kind != StartTag {
            return TokenSinkResult::Continue;
        }
        let name = tag.name.as_ref();
        let attr = |name: &str| {
            tag.attrs
                .iter()
                .find(|attr| &*attr.name.local == name)
                .map(|attr| {
                    if attr.value.is_empty() || attr.value.contains('&') {
                        self.1.set(true);
                    }
                    attr.value.as_ref()
                })
        };
        let mut page = self.0.borrow_mut();
        if let Some(id) = attr("id").filter(|id| !id.is_empty())
            && !page.ids.insert(id.to_owned())
        {
            page.duplicates.insert(id.to_owned());
        }
        if matches!(name, "a" | "img" | "script" | "link") {
            for url in [attr("href"), attr("src")]
                .into_iter()
                .flatten()
                .filter(|url| !url.is_empty())
            {
                page.links.push(url.to_owned());
            }
        }
        let href = attr("href").unwrap_or_default();
        match name {
            "html" => page.lang = attr("lang").unwrap_or_default().to_owned(),
            "h1" => page.headings += 1,
            "link" if attr("rel") == Some("canonical") => page.canonical = href.to_owned(),
            "link" if attr("rel") == Some("alternate") => {
                if let Some(lang) = attr("hreflang") {
                    page.alternates
                        .insert(lang.to_owned(), Value::String(href.to_owned()));
                } else {
                    self.1.set(true);
                }
            }
            "script" => {
                if let Some(src) = attr("src").filter(|src| !src.is_empty()) {
                    page.scripts.push(src.to_owned());
                }
                if !tag.self_closing {
                    return TokenSinkResult::RawData(Rawtext);
                }
            }
            "title" | "textarea" if !tag.self_closing => return TokenSinkResult::RawData(Rcdata),
            "style" if !tag.self_closing => return TokenSinkResult::RawData(Rawtext),
            "meta"
                if attr("http-equiv")
                    .is_some_and(|value| value.eq_ignore_ascii_case("content-security-policy")) =>
            {
                page.csp = attr("content").unwrap_or_default().to_owned();
            }
            _ => {}
        }
        TokenSinkResult::Continue
    }
}

pub fn page_metadata(text: String) -> Result<Value, String> {
    if let Some(page) = tokenize(&text) {
        return Ok(page);
    }
    Python::attach(|py| {
        let result = py
            .import("release_html.metadata")
            .and_then(|module| module.getattr("page_metadata"))
            .and_then(|function| function.call1((text,)))
            .map_err(|error| error.to_string())?;
        crate::pyconv::from_py(&result)
    })
}

fn tokenize(text: &str) -> Option<Value> {
    let input = BufferQueue::default();
    input.push_back(StrTendril::from(text));
    let parser = Tokenizer::new(Page::default(), Default::default());
    let _ = parser.feed(&input);
    parser.end();
    if parser.sink.1.get() || text.contains(['\r', '\0']) {
        return None;
    }
    let page = parser.sink.0.into_inner();
    Some(json!({
        "ids": page.ids, "duplicates": page.duplicates, "links": page.links, "lang": page.lang,
        "canonical": page.canonical, "h1": page.headings, "alternates": page.alternates,
        "scripts": page.scripts, "csp": page.csp,
    }))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn extracts_links_and_duplicate_ids_in_document_order() {
        let page = tokenize("<h1 id='標題'>Title</h1><img id='標題' src='a'><a href='#標題'>");
        let Some(page) = page else {
            panic!("expected fast path")
        };
        assert_eq!(page["duplicates"], json!(["標題"]));
        assert_eq!(page["links"], json!(["a", "#標題"]));
    }
}
