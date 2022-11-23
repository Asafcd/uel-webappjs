const newsService = require('../services/newsService')

const getAllNews = async (req, res) => { 
    try{
      const allNews = await newsService.getAllNews()
      res.send({status: "OK", data: allNews})
    } catch(err){res.status(err?.status || 500).send({ status: "FAILED", data: { error: err?.message || err } });}
    
}

const getCategorizedNews = async(req,res) =>{
    let {id} = req.params
    const categorizedNews = await newsService.getCategorizedNews(id)
    res.send({status: "OK", data: categorizedNews})
}

const getOneNew = async(req,res) => {
    let {id} = req.params
    const oneNew = await newsService.getOneNew(id)
    res.send({status:"OK", data:oneNew })
}

module.exports = {
    getAllNews,
    getCategorizedNews,
    getOneNew
}