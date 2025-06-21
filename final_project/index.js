const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  // 检查用户是否已登录（session 中是否有 authorization）
  if (req.session.authorization) {
    let token = req.session.authorization["accessToken"];

    // 验证 JWT token 是否有效
    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        // 如果验证成功，将用户数据挂载到 req.user，继续下一步处理
        req.user = user;
        next();
      } else {
        // token 错误或过期
        return res.status(403).json({ message: "User not authenticated" });
      }
    });
  } else {
    // 未登录或无 session
    return res.status(403).json({ message: "User not logged in" });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
