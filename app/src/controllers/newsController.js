const newsService = require('../services/newsService')
const tagService = require('../services/tagService')

const getAllNews = async (req, res) => { 
    try{
      const allNews = await newsService.getAllNews()
      //console.log(allNews)
      res.status(200).render("home.hbs", {data:allNews, tag:allNews.tag})
    } catch(err){res.status(err?.status || 500).send({ status: "FAILED", data: { error: err?.message || err } });}
    
}

const getNewsByCategory = async(req,res) =>{
    let {id} = req.params
    try{
        const data = await newsService.getNewsByCategory(id)
        res.status(200).render("noticias/templateSeccion.hbs",{data: data, tag:data.tags})
    }catch(err){res.status(err?.status || 500).send({ status: "FAILED", data: { error: err?.message || err } });}
}

const getNewById = async(req,res) => {
    let {id} = req.params
    try {
        const data = await newsService.getNewById(id)
        const tags = await tagService.getAllTags()
        res.status(200).render("noticias/noticia.hbs",{ data:data, tag:tags })
    } catch (err) {res.status(err?.status || 500).send({ status: "FAILED", data: { error: err?.message || err } });}
    
}

module.exports = {
    getAllNews,
    getNewsByCategory,
    getNewById
}