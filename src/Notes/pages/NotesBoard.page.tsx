import { Box, Card, CardContent, Typography } from "@mui/material";
import useNote from "../hooks/useNote";
import Page from "../../Common/components/Page";
import PushPinIcon from "@mui/icons-material/PushPin";

const NotesBoard = () => {
  const { fetchedNotes } = useNote(true);

  return (
    <Page title="Notes Board">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 2,
          width: "100%",
        }}
      >
        <Box
          sx={{
            maxWidth: "1200px",
            width: "100%", //
            backgroundColor: "burlywood",
            p: 3,
            borderRadius: 2,
            boxShadow: 4,
            border: "5px groove white",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, 250px)",
            gap: 2,
            justifyContent: "center",
            justifyItems: "start",
          }}
        >
          {fetchedNotes?.map(
            (note) =>
              note.status !== "inactive" && (
                <Card
                  key={note._id}
                  sx={{
                    width: "250px",
                    minHeight: 150,
                    position: "relative",
                    backgroundColor: note.isSticky ? "#fffbe6" : "#f9f9f9",
                    borderLeft: note.isSticky ? "6px solid orange" : "none",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom noWrap>
                      {note.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {new Date(note.date).toLocaleString()}
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                      {note.content.length > 100
                        ? note.content.slice(0, 100) + "..."
                        : note.content}
                    </Typography>
                  </CardContent>

                  {note.isSticky && (
                    <PushPinIcon
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "orange",
                        fontSize: 24,
                        transform: "rotate(45deg)",
                      }}
                    />
                  )}
                </Card>
              )
          )}
        </Box>
      </Box>
    </Page>
  );
};

export default NotesBoard;
