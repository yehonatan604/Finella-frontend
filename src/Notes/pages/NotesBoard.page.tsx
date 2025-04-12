import { Box, Card, CardContent, Typography } from "@mui/material";
import useNote from "../hooks/useNote";
import Page from "../../Common/components/Page";
import PushPinIcon from "@mui/icons-material/PushPin";

const NotesBoard = () => {
  const { fetchedNotes } = useNote(true);

  return (
    <Page title="Notes Board">
      <Box
        display="flex"
        justifyContent="center" // center the board itself
        width="100%"
        mt={2}
      >
        <Box
          px={2}
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "flex-start",
            width: "80%",
          }}
        >
          {fetchedNotes.map(
            (note) =>
              note.status !== "inactive" && (
                <Card
                  key={note._id}
                  elevation={note.isSticky ? 6 : 2}
                  sx={{
                    width: 240,
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
