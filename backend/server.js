const express = require('express');
const cors = require('cors');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
  const filePath = path.join(__dirname, req.file.path);
  let fraud = 0;
  let legit = 0;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      let classVal = row.Class || row.class || row.CLASS || '';
      classVal = classVal.toString().trim();

      if (classVal === '1') fraud++;
      else if (classVal === '0') legit++;
    })
    .on('end', () => {
      fs.unlinkSync(filePath); // delete file after processing
      res.json({ fraud, legit });
    })
    .on('error', (err) => {
      console.error("CSV Error:", err);
      res.status(500).json({ message: "Error processing CSV" });
    });
});

app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});
