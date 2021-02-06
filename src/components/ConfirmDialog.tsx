import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core"

const ConfirmDialog = ({word, open, handleClose}: any) => {
    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle>Excluir Palavra</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Tem certeza que quer excluir a palavra {word}?
                </DialogContentText>               
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose(false)} color="primary">
                    Cancelar
                </Button>
                <Button onClick={() => handleClose(true)} color="primary">
                    Excluir
            </Button>
            </DialogActions>
    </Dialog>
    )
}

export default ConfirmDialog;