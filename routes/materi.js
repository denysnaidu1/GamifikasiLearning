import express from 'express'
import loginUtils from '../controllers/auth/auth.js';
import materiUtils from '../controllers/materi.controller.js';
import { LoginModel } from '../models/userModel.js'
import responseModel from '../models/responseModel.js';
import constants from '../utils/constants.js';
import { plainToClass, plainToInstance } from 'class-transformer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promises as fsPromises } from 'fs';

var router = express.Router();

/* GET users listing. */
router.get('/details/:materiCode', async function (req, res, next) {
     var result = new responseModel();
     try {
          var materiCode = req.params.materiCode;
          result.body = await materiUtils.getMateriDetails(materiCode);
     } catch (exc) {
          result.message = exc;
     }
     res.end(JSON.stringify(result));
})

router.get('/download/:fileUrl', async function (req, res, next) {
     try {
          const fileUrl = req.params.fileUrl;
          const __filename = fileURLToPath(import.meta.url);
          const __dirname = dirname(__filename);
          const folderPath = join(__dirname, '..', 'materi_files');
          const filePath = join(folderPath, fileUrl);

          await fsPromises.access(filePath, fsPromises.constants.F_OK);
          res.download(filePath, function (err) {
               if (err) {
                    throw err;
               }
          })
     } catch (exc) {
          let err = exc;
          if (exc.code === 'ENOENT') {
               err = `File doesn't exist`;
          }
          res.status(constants.STATUS_CODE_INVALID_USER_REQUEST).send(err);
     }
});


export default router;
