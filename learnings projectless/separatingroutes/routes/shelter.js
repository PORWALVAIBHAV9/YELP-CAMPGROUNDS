const express = require('express');
const router = express.Router();

router.get('/', (req,res)=>{
    res.send('All shelter')
})

router.get('/:id', (req,res)=>{
    res.send('showing one shelter');
})
router.put('/:id/edit', (req,res)=>{
    res.send('editing shelter');
})
router.delete('/:id/delete', (req,res)=>{
    res.send('deleting shelter');
})


module.exports = router;