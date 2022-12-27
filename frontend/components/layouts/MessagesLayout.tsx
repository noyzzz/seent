import { Box, IconButton, Theme, useMediaQuery } from "@mui/material";
import { Styles, ThemedStyles } from "../../types";
import TopAppBar from "../navigation/TopAppBar";
import CreateRoomModal from "../rooms/CreateRoomModal";
import { getMainLayout } from "./MainLayout";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { useAPI } from "../../hooks/useAPI";
import MenuItem from "../navigation/MenuItem";
import { getDisplayedRoomTitle } from "../../utils";
import { useRouter } from "next/router";

type Props = {
  children: React.ReactNode;
};

const MessagesLayout = ({ children }: Props) => {
  const [createRoomOpen, setCreateRoomOpen] = useState(false);
  const { user } = useUser();
  const { data: rooms, mutate: mutateRooms } = useAPI<any[]>(
    `rooms?userId=${user?.userId}`
  );
  const router = useRouter();
  const inARoom = router.pathname.startsWith("/messages/");
  const tabletOrMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("lg")
  );
  const showRoomList = !inARoom || !tabletOrMobile;

  const mobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const showRoom = inARoom || !mobile;

  return (
    <>
      <TopAppBar title="Messages">
        <Box sx={styles.appBar}>
          <IconButton onClick={() => setCreateRoomOpen(true)}>
            <AddIcon />
          </IconButton>
        </Box>
      </TopAppBar>

      <Box sx={styles.root}>
        {showRoomList && (
          <Box sx={styles.roomList}>
            {rooms?.map((room) => (
              <MenuItem
                sx={{
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
                key={room.roomId}
                href={`/messages/${room.roomId}`}
              >
                {getDisplayedRoomTitle(room, user as any)}
              </MenuItem>
            ))}
          </Box>
        )}
        {showRoom && <Box sx={styles.room}>{children}</Box>}
      </Box>
      {createRoomOpen && (
        <CreateRoomModal
          open={createRoomOpen}
          setOpen={setCreateRoomOpen}
          mutateRooms={mutateRooms}
        />
      )}
    </>
  );
};

const styles: ThemedStyles = {
  root: {
    height: (theme) =>
      `calc(100% - 10px - ${theme.mixins.toolbar.minHeight}px)`,
    maxHeight: (theme) =>
      `calc(100vh - 10px - ${theme.mixins.toolbar.minHeight}px)`,
    display: "flex",
  },
  roomList: {
    display: "flex",
    flexDirection: "column",
    width: {
      sm: 300,
      xs: "100%",
    },
    borderRight: {
      sm: "1px solid",
    },
    borderBottom: {
      md: "1px solid",
      xs: "none",
    },
    borderColor: {
      md: "divider",
      sm: "divider",
    },
  },
  room: {
    flex: 1,
    width: {
      sm: "70%",
      xs: "100%",
    },
    borderBottom: {
      md: "1px solid",
      sm: "none",
    },
    borderColor: {
      md: "divider",
    },
    height: "100%",
  },
  appBar: {
    display: "flex",
    justifyContent: "flex-end",
    width: "100%",
  },
};

export const getMessagesLayout = (page: React.ReactNode) =>
  getMainLayout(<MessagesLayout>{page}</MessagesLayout>);

export default MessagesLayout;
