import { Box, Card, CardContent, Typography } from "@mui/material";
import useNote from "../hooks/useNote";
import Page from "../../Common/components/Page";
import PushPinIcon from "@mui/icons-material/PushPin";
import useTheme from "../../Common/hooks/useTheme";

const NotesBoard = () => {
  const { fetchedNotes } = useNote(true);
  const { mode } = useTheme();

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
            border: "5px groove white",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, 250px)",
            gap: 2,
            justifyContent: "center",
            justifyItems: "start",
          }}
          style={{
            boxShadow: mode === "dark" ? "0 2px 10px azure" : "0 2px 10px grey",
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
                    <Typography variant="h6" color="black" gutterBottom noWrap>
                      {note.name}
                    </Typography>
                    <Typography variant="body2" color="silver" sx={{ mb: 1 }}>
                      {new Date(note.date).toLocaleString()}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="grey"
                      sx={{ whiteSpace: "pre-line" }}
                    >
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
