const express = require('express');
const router=  express.Router();

router.get('/', (req,res)=>{
    res.send('All dogs');
})
router.get('/:id', (req,res)=>{
    res.send('showing one dog');
})
router.post('/:id/edit', (req,res)=>{
    res.send('editing dog');
})
router.get('/:id/delete', (req,res)=>{
    res.send('deleting dog');
})

module.exports = router;