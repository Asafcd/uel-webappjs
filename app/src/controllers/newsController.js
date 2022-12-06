const newsService = require('../services/newsService')
const tagService = require('../services/tagService')

const getAllNews = async (req, res) => { 
    try{
        const tags = await tagService.getAllTags()
        const allNews = await newsService.getAllNews()
      //console.log(allNews)
      res.status(200).render("home.hbs", {data:allNews, tag:tags})
    } catch(err){res.status(err?.status || 500).send({ status: "FAILED", data: { error: err?.message || err } });}
    
}

const getNewsByCategory = async(req,res) =>{
    let {id} = req.params
    try{
        const tags = await tagService.getAllTags()
        const data = await newsService.getNewsByCategory(id)
        res.status(200).render("noticias/templateSeccion.hbs",{data: data, tag:tags})
    }catch(err){res.status(err?.status || 500).send({ status: "FAILED", data: { error: err?.message || err } });}
}

const getNewById = async(req,res) => {
    let {id} = req.params
    //console.log(typeof(id))
    try {
        const data = await newsService.getNewById(id)
        const tags = await tagService.getAllTags()
        res.status(200).render("noticias/noticia.hbs",{ data:data, tag:tags })
    } catch (err) {res.status(err?.status || 500).send({ status: "FAILED", data: { error: err?.message || err } });}
    
}

const getNewsByStatus = async(req,res) =>{
    const {id_status} = req.params
    let status = ''
    try {
        switch (id_status) {
            case '0':
                status = 'Enviada'
                break;
            case '1':
                status = 'Aceptada'
                break;
            case '2':
                status = 'Rechazada'
                break;
        
            default:
                status = 'Enviada'
                break;
        }
        const tag = status
        const tags = await tagService.getAllTags()
        const data = await newsService.getNewsByStatus(status)
        res.status(200).render('admin/noticiasadmin.hbs', {data,tag,tags})
        
    } catch (err) {res.status(err?.status || 500).send({ status: "FAILED", data: { error: err?.message || err } });}
}

module.exports = {
    getAllNews,
    getNewsByCategory,
    getNewById,
    getNewsByStatus
}