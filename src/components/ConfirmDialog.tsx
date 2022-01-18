import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, DialogProps } from "@material-ui/core";
import { WordProps } from "../containers/Word";

interface ConfirmDialogProps extends DialogProps {
    word: WordProps;
    handleClose: (response: boolean) => void;
}

const ConfirmDialog = ({word, open, handleClose}: ConfirmDialogProps) => {
    return (
        <Dialog open={open} onClose={() => handleClose(false)} aria-labelledby="form-dialog-title">
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