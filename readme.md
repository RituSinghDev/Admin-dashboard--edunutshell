base url :- https://edunutshell-lms.onrender.com"

GET all blogs
https://edunutshell-lms.onrender.com/api/blogs/


create new blog
<!-- POST -->
Header: Authotization Bearer<token>
Body:
{
  "title": "Why Every Developer Should Learn Backend Before Frontend Frameworks",
  "body": "Understanding how servers, databases, and APIs work gives you a huge edge when using frontend frameworks. Backend knowledge makes you a stronger full-stack developer.",
  "image": "https://example.com/images/backend-first.jpg",
  "tags": ["backend", "fullstack", "advice"],
  "eventDate": "2025-10-01"
}

https://edunutshell-lms.onrender.com/api/blogs/


delete blog                                    blogId
<!-- Delete -->
Header: Authotization Bearer<token>
Body:{

}
https://edunutshell-lms.onrender.com/api/blogs/6903cfe20108a4a764d41240


update a blog                                   blog Id
<!-- Patch -->
Header: Authotization Bearer<token>
Body:
    {
    "title":"How I Learned Node.js in 30 Days",
    "body":"I started with basic JavaScript concepts, then moved into asynchronous programming, Express, and building APIs. The key was building small projects every few days to stay consistent."
}

https://edunutshell-lms.onrender.com/api/blogs/6903cd01f2ddd9bda30f06c4