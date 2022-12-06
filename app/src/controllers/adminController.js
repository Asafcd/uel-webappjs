const userService = require("../services/userService")
const newsService = require("../services/newsService")
const fuentesService = require("../services/fuenteService")
const msgService = require('../services/mensajeService')

const getNewById = async(req,res) =>{
    const {id_noticia} = req.params
    try {
        const data = newsService.getNewById(id_noticia)        
        res.status(200).render('admin/vistanoticia.hbs', {data:data[0]})
    } catch(err){res.status(err?.status || 500).send({ status: "FAILED", data: { error: err?.message || err } });}
}
const getNewDeclinedById = async (req,res)=>{
    let {id_noticia} = req.params
    try{
        let data = await pool.query("SELECT id_noticia, titulo FROM noticias WHERE id_noticia=?", [id_noticia])
        res.render('admin/mensaje.hbs', {data:data})
    } catch(err){res.status(err?.status || 500).send({ status: "FAILED", data: { error: err?.message || err } });}
}

const updateStatusNewById= async (req,res)=>{
    const {id_noticia, status_boolean} = req.params
    let status = ''
    if(status_boolean==='0'){status='Rechazada'}
        else{ if(status_boolean==='1'){status='Aceptada'}}
    try{
        await newsService.updateNewStatusById(id_noticia, status)
        if(status==='Aceptada'){res.redirect('/admin/status/0')}
        else{ if(status==='Rechazada'){
            res.redirect('/admin/mensaje/'+id_noticia)
        }}
        
    }catch(err){res.status(err?.status || 500).send({ status: "FAILED", data: { error: err?.message || err } });}
}

const postMensaje = async (req,res)=>{
    let {id_noticia} = req.params
    let {contenido} = req.body
    try{
        await msgService.postMensaje(id_noticia,contenido)
        res.redirect('/news/status/2')
    }catch(err){res.status(err?.status || 500).send({ status: "FAILED", data: { error: err?.message || err } });}
}

module.exports ={
    getNewById,
    updateStatusNewById,
    getNewDeclinedById,
    postMensaje
}