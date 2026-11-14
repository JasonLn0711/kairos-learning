import sqlite3

# 建立只存在記憶體中的資料庫
db = sqlite3.connect(":memory:")
cursor = db.cursor()

# 建立 users 資料表
cursor.execute(
    "CREATE TABLE users (username TEXT, role TEXT)"
)

# 新增兩筆測試資料
cursor.executemany(
    "INSERT INTO users VALUES (?, ?)",
    [
        ("Alice", "admin"),
        ("Bob", "user"),
    ],
)

# 模擬惡意輸入
username = "' OR '1'='1"

# 寫法一：不安全的字串拼接
unsafe_sql = (
    "SELECT * FROM users WHERE username = '"
    + username
    + "'"
)
cursor.execute(unsafe_sql)
print("不安全查詢：", cursor.fetchall())

# 寫法二：安全的參數化查詢
cursor.execute(
    "SELECT * FROM users WHERE username = ?",
    (username,),
)
print("參數化查詢：", cursor.fetchall())
db.close()
