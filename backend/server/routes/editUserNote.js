const express = require("express");
const router = express.Router();
const noteModel = require('../models/noteModel');


router.put('', async (req, res) => {

    var {userId, stationId} = req.body

    const userNoteId = await noteModel.findOne({ userId: userId })    

    if (userNoteId != null){
               

        if (Object.keys(userNoteId.stationId).indexOf(Object.keys(stationId)[0]) > -1){

            Object.assign(userNoteId.stationId,stationId)
            //stationId = userNoteId.stationId
            
            noteModel.findByIdAndUpdate(userNoteId._id, 
            {
                stationId : userNoteId.stationId
            } ,function (err, noteInfo) {
            if (err){
                console.log(err);
            } else {
                res.status(200).send({ message: "Note edited successfully"})
            }
            });
        }
        else{
            res.status(404).send({ message: "Error: Note not found." })
        }
    }
    else{
        res.status(404).send({ message: "Error: User not found." })
    }
})


module.exports = router;