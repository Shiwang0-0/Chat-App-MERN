import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from "@mui/material";
const DeleteGroupDialog = ({ confirmDeleteDialog, closeConfirmDeleteHandler, deleteHandler }) => {
  return (
    <Dialog open={confirmDeleteDialog} onClose={closeConfirmDeleteHandler}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this group?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeConfirmDeleteHandler}>No</Button>
        <Button onClick={deleteHandler} color="error">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  )

};

export default DeleteGroupDialog;