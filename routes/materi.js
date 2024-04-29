import express from 'express';
import multer from 'multer';
import loginUtils from '../controllers/auth/auth.js';
import materiUtils from '../controllers/materi.controller.js';
import MateriViewModel from '../viewModels/materiViewModel.js';
import { LoginModel } from '../models/userModel.js'
import responseModel from '../models/responseModel.js';
import constants from '../utils/constants.js';
import { plainToClass, plainToInstance } from 'class-transformer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promises as fsPromises } from 'fs';

const storage = multer.diskStorage({
     destination: (req, file, cb) => {
          cb(null, 'materi_files/') // Directory where files will be saved
     },
     filename: (req, file, cb) => {
          cb(null, file.originalname) // Naming convention for saved files
     }
});

const upload = multer({ storage: storage });

var router = express.Router();

router.get('/admin/', async function (req, res, next) {
     var result = new responseModel();
     try {
          result.body = await materiUtils.getAllMateries();
     } catch (exc) {
          result.message = exc;
     }
     res.end(JSON.stringify(result));
})

router.get('/admin/details/:id', async function (req, res, next) {
     var result = new responseModel();
     try {
          const materiId = req.params.id;
          result.body = await materiUtils.getAdminMateriDetails(materiId);
     } catch (exc) {
          result.message = exc;
     }
     res.end(JSON.stringify(result));
})

router.post('/admin/submit', upload.any(), async function (req, res, next) {
     var result = new responseModel();
     try {
          var username = req.get("username");
          console.log(username);
          const transformedBody = transformRequestBody(req.body);
          const model = plainToInstance(MateriViewModel, transformedBody);
          if(req.files){
               req.files.forEach((file)=>{
                    if(file.fieldname == "file"){
                         model.Content = file.originalname;
                    }
                    else{
                         const match = file.fieldname.match(/subMateries\[(\d+)\]\.file/);
                         const index = match[1];
                         model.subMateries[index].Content = file.originalname;
                    }
               })
          }
          console.log(model);
          result.message = await materiUtils.submit(model);
          if (result.message != constants.STATUS_OK) {
               throw result.message;
          }
     } catch (exc) {
          if(req.files){
               req.files.forEach((file)=>{
                    fsPromises.unlink(file.path);
               })
          }
          console.log(exc);
          result.message = exc;
          result.statusCode = constants.STATUS_CODE_VALIDATION_ERROR;
     }
     res.end(JSON.stringify(result));
});


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
          console.log(fileUrl);
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

function transformRequestBody(flatObject) {
     const result = {};
 
     Object.entries(flatObject).forEach(([key, value]) => {
          // Preserve null values as null
          if (value === 'null') {
              value = null;
          }
  
          const parts = key.split(/[\.\[\]]/).filter(part => part !== '');
          let currentLevel = result;
  
          parts.forEach((part, index) => {
              // Check if we're at the last part of the key
              if (index === parts.length - 1) {
                  // Assign the value directly
                  currentLevel[part] = value;
              } else {
                  // Prepare for the next level of nesting
                  const nextPartIsArray = parts[index + 1].match(/^\d+$/) !== null;
                  if (!currentLevel[part]) {
                      currentLevel[part] = nextPartIsArray ? [] : {};
                  }
                  currentLevel = currentLevel[part];
              }
          });
      });
 
     return result;
 }

export default router;
