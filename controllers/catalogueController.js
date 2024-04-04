const bcrypt                = require('bcryptjs');
const { validationResult }  = require('express-validator');
const Catalogue             = require('../models/catalogue');

class CatalogueController {

    static async getChildren(req, res) {
        
        const catalogue = new Catalogue({            
            name: req.query.name
        });     

        try {
            
            let existCatalogue = await Catalogue.getCatalogue('name', catalogue.name);

            if (!existCatalogue || existCatalogue.length == 0){
                return res.status(400).json({error: 'Catalogue', code: 'c001', msg: 'El catalogo no existe'});
            };

            let children = await Catalogue.getChildren(existCatalogue[0].id); 

            return res.status(200).json({data: children});

        } catch (error) {
            console.error(error)
            return res.status(500).json({error: 'Server', code: 'e001', msg: 'Error de servidor'});
        };
    };
}

module.exports = CatalogueController;