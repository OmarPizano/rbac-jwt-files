import express from "express";
import fs from "fs/promises";
import multer from "multer";
import { auth } from "../middlewares/auth.middleware.js";
import File from "../models/file.model.js";

const filesRouter = express.Router();

// this /uploads dir is mounted when the container is created
const uploadDir = multer({ dest: "/uploads" });

filesRouter.get("/files", auth("admin", "user"), async (req, res) => {
  try {
    // admin can get every file; other roles can only get role defined files
    const files = (req.accountData.role_id === 1) ?
      await File.findAll():
      await File.findAll({ where: { role_id_required: req.accountData.role_id } });

    res.status(200).json({ data: files });
  } catch (error) {
    console.log(`ERROR: ${req.method} ${req.originalUrl}: ${error}`);
    res.status(500).json({ message: "internal server errror" }); 
  }
});

filesRouter.get("/files/:filename", auth("admin", "user"), async (req, res) => {
  try {
    // admin can get every file; other roles can only get role defined files
    if (req.accountData.role_id !== 1) {
      // get file that match filename and role
      const file = await File.findOne({ where: { filename: req.params.filename, role_id_required: req.accountData.role_id } });
      if (!file) return res.status(404).json({ message: "file not found or access denied" });
    }
    // return requested file through nginx
    const file = `/uploads/${req.params.filename}`;
    res.setHeader("X-Accel-Redirect", file);
    // NOTE: not using status() or sendStatus() because they change the content-type
    res.send();
  } catch (error) {
    console.log(`ERROR: ${req.method} ${req.originalUrl}: ${error}`);
    res.status(500).json({ message: "internal server errror" }); 
  }
});

// curl HOST/api/file -X POST -H 'Authorization: Bearer TOKEN' -H 'Content-Type: multipart/form-data' -F 'file=@/path/to/file.pdf -F 'role_id_required=1''
filesRouter.post("/files", auth("admin"), uploadDir.single('file'), async (req, res) => {
  // NOTE: by default, multer will upload the file with a unique filename

  // validate params
  const { role_id_required } = req.body;
  if (!role_id_required) return res.status(400).json({ message: "expected parameters: roled_id_required" });

  try { 
    // create the uploaded_file record
    await File.create({ filename: req.file.filename, role_id_required });

    res.status(201).json({ data: req.file.filename });
  } catch (error) {
    console.log(`ERROR: ${req.method} ${req.originalUrl}: ${error}`);
    res.status(500).json({ message: "internal server errror" }); 
  }
});

filesRouter.delete("/files/:filename", auth("admin"), async (req, res) => {
  try {
    // check if the file exists
    const file = await File.findOne({ where: { filename: req.params.filename } })
    if (!file) return res.status(404).json({ message: "file not found" }); 

    // remove file from filesystem
    // NOTE: await/async only available with fs 'promisified' version fs/promises
    const path = `/uploads/${req.params.filename}`;
    await fs.access(path);
    await fs.unlink(path);

    // remove file record
    await file.destroy();
    
    res.sendStatus(204);
  } catch (error) {
    console.log(`ERROR: ${req.method} ${req.originalUrl}: ${error}`);
    res.status(500).json({ message: "internal server errror" }); 
  }
});

filesRouter.patch("/files/:filename", auth("admin"), async (req, res) => {
  const { role_id_required } = req.body;
  if (!role_id_required) return res.status(400).json({ message: "expected parameters: role_id_required" });

  try {
    // get file
    const file = await File.findOne({ where: { filename: req.params.filename } })
    if (!file) return res.status(404).json({ message: "file not found" }); 

    // change permissions
    file.role_id_required = role_id_required;
    await file.save();

    res.sendStatus(204);
  } catch (error) {
    console.log(`ERROR: ${req.method} ${req.originalUrl}: ${error}`);
    res.status(500).json({ message: "internal server errror" }); 
  }
});

export default filesRouter;
