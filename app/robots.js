// Search Engine Optimization (SEO)
export default function  robots(){
  return{
    rules: [
      {
        userAgent: "*",
        allowed: "/",
        disallowed: [
          "/authusers/LogIn",
          "/authusers/SignUp",
          "/authusers/CheckEmail",
          "/authusers/ForgetPasswordPage",
          "/contact",
          "/community",
          "/api"
        ],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`
  }
}