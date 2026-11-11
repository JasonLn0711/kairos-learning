# M06-04 | Browser, HTTP, APIs and Data Flow: A Complete Plain-language Lesson

Clicking one button on a web page can trigger many operations: transferring data, running code, validating inputs, accessing a database and returning a result.

Understanding this chain helps you read how websites work and judge whether a system architecture drawn by an AI Coding Agent is reasonable.

## 1. Start with an everyday example: ordering food online

Imagine using a restaurant website on your phone. You choose beef noodles and press “Submit order”.

Behind that single button are several responsibilities. Follow the information through the six conceptual steps below.

@figure1

This is a conceptual data flow for a typical website; actual websites need not implement exactly this architecture. The interface visible to the user is one part of the whole system.

## 2. How do browsers, HTTP and APIs differ?

Use the restaurant analogy to separate the responsibilities.

| Term | Plain-language meaning | Restaurant analogy |
| --- | --- | --- |
| Browser | Software for operating a website and displaying results | Ordering tablet |
| HTTP | A protocol for exchanging requests and responses between client and server | Rules for transmitting order slips |
| API | An interface contract specifying services software can request and how to exchange data | Specification for accepted orders |
| Server | Receives requests, executes code and produces responses | Kitchen and order-processing system |
| Database | Stores and queries data | Order and inventory records |

Two distinctions matter. HTTP is a communication protocol; an API is an interface contract. An API can provide a service over HTTP, or it can be a Python function called by another part of a program.

An API need not be a REST API. REST is an architectural style for Web APIs; many APIs use other approaches.

MDN describes HTTP in terms of a client sending a request and a server producing a response to exchange information.

## 3. HTTP: how does a computer send a digital order?

An HTTP exchange generally has a request and a response.

### 1. Request

Suppose we design an ordering API. The following address and content are hypothetical teaching examples, not endpoints implemented by this course.

```
POST /api/orders HTTP/1.1
Host: restaurant.example
Content-Type: application/json

{
  "item": "beef_noodles",
  "quantity": 2
}
```

Read the message as four parts:

- Method: `POST` expresses the intended operation.
- Path: `/api/orders` identifies the resource or service location.
- Headers: `Content-Type`, for example, describes the data format.
- Body: the actual submitted data, such as the item and quantity.

Together, these parts form an HTTP request.

### 2. Response

The server could respond as follows:

```
HTTP/1.1 201 Created
Content-Type: application/json

{
  "order_id": "A1024",
  "status": "accepted"
}
```

Under this API contract, the server reports that an order resource was created. Creating an order does not establish that the food has been cooked.

### Common HTTP methods

| Method | Common purpose | Example |
| --- | --- | --- |
| GET | Retrieve a resource | Query an order |
| POST | Submit data for processing | Create an order |
| PUT | Create or completely replace a specified resource | Replace the full order record |
| PATCH | Partially modify a resource | Change delivery notes |
| DELETE | Delete a resource | Delete a draft order |

These are common semantics. They do not automatically enforce business rules; the API design and server implementation determine which operations are allowed.

## 4. Why does HTTP 200 not establish task completion?

Suppose a hospital website allows patients to upload test reports. After receiving a request, a hypothetical API returns:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": false,
  "error": "missing_patient_id"
}
```

The HTTP status is `200 OK`, but the body says `success: false`. This contract distinguishes successful request handling from failed business validation. In practice, an API can instead use an appropriate 4xx status, such as `422 Unprocessable Content`, according to its contract.

Check success at three levels:

@figure2

Passing one level does not guarantee the others. An HTTP response alone cannot prove that the requested business outcome or final user task is complete.

### Common HTTP status codes

| Status | Plain-language meaning |
| --- | --- |
| 200 OK | This HTTP request succeeded |
| 201 Created | A resource was successfully created |
| 400 Bad Request | There is a problem with the request |
| 401 Unauthorized | Valid authentication credentials are missing |
| 403 Forbidden | Access is refused |
| 404 Not Found | The requested resource was not found |
| 500 Internal Server Error | An internal server error occurred |
| 503 Service Unavailable | The service cannot currently handle the request |

The status-code reference is MDN HTTP response status codes. These descriptions concern HTTP semantics; determine the business outcome from the API contract and actual response content.

## 5. Buttons need not call REST APIs: Streamlit

Seeing a “Check” button does not establish that pressing it sends `POST /api/check`. Consider this Python Streamlit page:

```
import streamlit as st


def validate(name):
    return bool(name.strip())


name = st.text_input("姓名")
if st.button("檢查"):
    if validate(name):
        st.success("資料完整")
    else:
        st.error("請填寫姓名")
```

The Chinese labels mean “Name”, “Check”, “Data complete” and “Please enter a name”. The code defines no `/api/check` REST endpoint.

Streamlit manages interaction between the browser and the Python server, using mechanisms including HTTP and WebSocket. A WebSocket maintains a two-way connection through which the server can send updates to the browser.

@figure3

Both paths are conceptual. Confirm actual requests, WebSocket messages and other connections using framework documentation, source code or captured traffic.

Separate in-process function calls from network API calls. Python's `validate()` can run inside the same process without an HTTP request.

To try this locally, use an environment with Python and Streamlit already installed, save the code as `app.py` and run `streamlit run app.py`. Leave the name blank and press “Check” to see the missing-name message; enter a synthetic name and check again to see the complete-data message. Stop the local server with Ctrl+C when finished. These UI results do not establish a REST endpoint or production authorization.

## 6. Where data is checked determines the security boundary

Consider a bank credit-report system. The browser requires a company's registration number to contain eight digits. Browser-only validation can still be bypassed: the browser is under the user's control, and another program can submit data that ignores the interface restriction.

Check responsibilities at several boundaries:

| Boundary | Required responsibility |
| --- | --- |
| Browser | Explain formatting errors and improve the interaction |
| Server | Recheck format, type, length, business conditions and permissions |
| Database | Maintain consistency through appropriate constraints |
| Export function | Confirm that current data is valid and the user may export it |

Pay particular attention to stale data. A user enters a complete record and passes validation, then deletes a required field. If the old download button remains available and the backend trusts the earlier validation result, it may export incomplete data.

Edits must invalidate the earlier result. Revalidate current data at the export entry point when needed, and check access permission there. This follows the principle “Never Trust the Client”: client-side checks help users, while trusted processing must enforce the rules.

## 7. The same ideas across industries

The same data-flow and outcome checks apply to work in different industries.

| Industry | User action | Business outcome to verify |
| --- | --- | --- |
| E-commerce | Press checkout | Payment, stock and order state agree |
| Healthcare | Upload a report | Valid file, correct patient and authorized access |
| Finance | Export a credit report | Complete required data and passed permission checks |
| Education | Submit an assignment | The server saved the correct version within the deadline |
| Manufacturing | Submit an equipment repair request | A work order exists and the equipment ID is valid |
| AI Agent | Execute an external tool | The call was authorized and its intended result actually completed |

The same reasoning applies to AI Agents. A tool returning `200 OK` does not prove payment completion, successful file creation or the intended external effect. Inspect its response content and query the resulting state when necessary.

## 8. Practice: trace one web data flow

In Chrome or Edge, open a local test website that you control. Press `F12` to open Developer Tools, select `Network`, then operate the page.

The example below illustrates an interface; actual browser interfaces can differ. Its entries are simulated, not traffic captured from the teaching website.

@figure4

Learn to inspect four things in Network:

1. Headers: where did the request go, which method did it use, and which status came back?
2. Payload: if a request body exists, what data was submitted?
3. Response: what result did the server return?
4. WS / Messages: for a WebSocket, which messages can actually be observed?

Keep expected behavior separate from observed behavior. Use synthetic test data and do not publish Cookies, Tokens, personal data or other sensitive content.

The simulated `101` illustrates an HTTP/1.1 WebSocket protocol upgrade. It is not an application-task success status, and not every deployment or protocol version will show the same handshake representation.

## 9. A way to reason about any Web system

Use five questions to examine a system:

1. Who initiates the action: a user, the browser or a background program?
2. How does data move: HTTP, WebSocket, function calls or another mechanism?
3. Who processes it: which server, process or component?
4. Who validates it: where are current data, permissions and state checked again?
5. What proves completion: HTTP success alone, or a checked business result and final artifact?

Record the five answers in `architecture.md` to build a basic data-flow analysis. Label documentation, code inspection and live observations separately; leave unobserved details pending.

## 10. Check your understanding

Try the three questions in the understanding-check section before opening their reference explanations. The central lesson is that a success message, successful communication and a completed business outcome each need their own verification.
