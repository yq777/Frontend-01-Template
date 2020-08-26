# 每周总结可以写在这里

- ```https://github.com/login/oauth/authorize?client_id=Iv1.162be541f93b3b5f&redirect_uri=http%3A%2F%2Flocalhost%3A8000&scope=read%3Auser&state=123abc```回调的url会带个code（```http://localhost:8000/?code=cff68190e834c6da59a6&state=123abc```）,code是入场券，入场券和通行证是两回事，code不是token,state是全程带着的防止跨站攻击
- 在localhost里面拿code换token
- POST ```https://github.com/login/oauth/access_token```（code换token Url）
- 要带client_secret的原因是因为client_id大部时间是公开的，client_secret是私有的，存在服务器上不公开的
  