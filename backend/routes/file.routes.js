import express from "express";
import multer from "multer";
import { authenticateToken, authorizeRole } from "../middlewares/auth.middleware.js";

const fileRouter = express.Router();

// this /uploads dir is mounted when the container is created
const uploadDir = multer({ dest: "/uploads" });

fileRouter.get("/file/:filename", (req, res) => {
  // this path is sent back to client but intercepted by nginx to return that
  // file, so the path must match the nginx location.
  const file = `/uploads/${req.params.filename}`;
  res.setHeader("X-Accel-Redirect", file);

  // do NOT use sendStatus() or it will send the file as text/plain and the
  // browser will show the PDF as binary text
  // ALSO: the nginx.conf line 'include /etc/nginx/mime.types;' does some magic
  // in detecting the correct mimetype and setting the proper 'Content-Type'
  // header.
  res.send();
})

// curl HOST/api/file -X POST -H 'Content-Type: multipart/form-data' -F '@file=/path/to/file.pdf'
fileRouter.post("/file", uploadDir.single('file'), (req, res) => {
  // by default, multer will upload the file with a unique filename to avoid
  // conflicts
  res.send({ filePath: `/uploads/${req.file.filename}` });
})

export default fileRouter;
