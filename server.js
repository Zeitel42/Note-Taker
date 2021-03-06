const express = require("express");
const fs = require("fs");
const path = require("path");
const notes = require("./db/db.json");
const uuid = require("./helpers/uuid.js");
// const deleteNote = require("./delete/delete.js");

const PORT = process.env.PORT || 3001;

const app = express();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//set static folder
app.use(express.static("public"));

//post for new note
let newId = uuid();
let parsedNotes;
app.post("/api/notes", (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      id: newId,
      title: `${title}`,
      text: `${text}`,
    };

    // Obtain existing notes
    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object

        parsedNotes = JSON.parse(data);

        // Add a new note
        parsedNotes.notes.push(newNote);
        notes;
        // Write updated notes back to the file
        fs.writeFile(
          "./db/db.json",
          JSON.stringify(parsedNotes, null, 2),
          (writeErr) => {
            if (writeErr) {
              console.error(writeErr);
            } else {
              console.info("Successfully updated!");

              res.send("added note");
            }
          }
        );
      }
    });
  } else {
    res.json("Error in posting note");
  }
});

// get for delete
app.delete("/api/notes/:id", (req, res) => {
  console.info(`${req.method} request received to delete a note`);

  // Obtain existing notes
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object

      parsedNotes = JSON.parse(data);

      // find note by id

      const result = req.params.id;
      console.log(result);
      parsedNotes.notes.forEach((element) => {
        if (result === element.id) {
          var index = parsedNotes.notes.findIndex(function (o) {
            return o.id === element.id;
          });
          if (index !== -1) parsedNotes.notes.splice(index, 1);
        }
      });

      console.log(parsedNotes);
      // Write updated notes back to the file
      fs.writeFile(
        "./db/db.json",
        JSON.stringify(parsedNotes, null, 2),
        (writeErr) => {
          if (writeErr) {
            console.error(writeErr);
          } else {
            console.info("Successfully updated!");
            res.send("deleted note");
          }
        }
      );
    }
  });
});

//route to db.json notes
app.get("/api/notes", (req, res) => {
  // res.sendFile(path.join(__dirname, "./db/db.json"));
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object

      const parsedNotes = JSON.parse(data);
      res.json(parsedNotes.notes);
    }
  });
});

//route to notes.html
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});
// route to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
