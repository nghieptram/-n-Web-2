const {Router} = require('express')
const Todo = require('../services/todos')
const asyncHandler = require('express-async-handler')
const requireLoggedIn = require('../middlewares/requireLoggedIn')
const requireToken = require('../middlewares/requireToken')
const router = new Router()
router.use(requireLoggedIn);
router.use(requireToken);
router.get('/',asyncHandler(async function(req,res){
    const todos = await Todo.findAllNotDone(req.currentUser.id);
    res.render('todos',{todos})
}))
router.get('/:id/done',asyncHandler(async function(req,res){
    const {id} = req.params;
    const todo = await Todo.findById(id);
    console.log(todo.userId)
    if(todo && todo.userId === req.currentUser.id){
        await todo.markAsDone();
    }
    res.redirect('/todos')
}))
router.post('/',asyncHandler(async function(req,res){
        await Todo.add(req.body.newtodo,req.currentUser.id);
        res.redirect('/todos')
}))
module.exports = router