This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# 1 需求分析

# 2 chapter 1

- login 页面
  - Form
    - 单选 Radio group
    - 文本框 email password
    - checkbox
    - button
    - sign up link
  - 业务逻辑
    - validation
      - Radio group 必选一个 role
      - email 符合格式
      - password 4-16 位 字符，数字，字母，下划线
    - sign in
      - api 请求 /api/login, {
        email: string
        password: decrypt('111111'+'cms')
        role: 'student'|'manager'|'teacher'
        }
      - response
        - success ----> 进入 dashboard，localStorage 保存 userInfo
        - failed -----> 相应提示
  # 2 chapter 2
  - dashboard 页面
    - side menu
      - manager
        - overview
        - student
          - student list
        - teacher
          - teacher list
        - course
          - course list
          - add course
          - edit course
        - message
      - teacher
        - overview
        - class schedule
        - student
          - student list
        - course
          - course list
          - add course
          - edit course
        - message
      - student
        - overview
        - class schedule
        - course
          - course list
          - my course
        - message
    - side menu 收缩按钮
    - avatar
      - logout
  - logout
    - localStorage 中取出 token
    - api 请求 api/logout,{
      {},
      headers:{
      authentication: $token
      }
      }
      - success ---> 返回登入页面,删除 localStorage
      - failed ----> 提示
  - student list
    - api 请求 api/student, {
      }
