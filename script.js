
//requiring path and fs modules
const path = require('path');
const fs = require('fs');
const readXlsxFile = require('read-excel-file/node');

//files directories 
const deParaFilePath = "./DePara.xlsx"
const inputPath = './input_images'; //path.join(__dirname, 'Documents');
const outputPath = './output_images';
const extension = '.png';


//passsing directoryPath and callback function
fs.readdir(inputPath, async function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 

    const rows = await readXlsxFile(deParaFilePath);
    //listing all files using forEach
    let notFoundImagesOnSheetCount = 0;
    let notFoundImagesOnSheet = '';
    for(const file of files) {
        // Do whatever you want to do with the file
        let name = file.replace(extension,''); 
        let found = false;

        for(const row of rows) {
          if(row[0].trim() == name) {
            found = true;

            fs.copyFile( `${inputPath}/${file}`, `${outputPath}/${row[1].trim()}${extension}`, (err)=>{
              if(err) {
                console.log(err);
              }
            });
          }
        }

        if(!found) {
          notFoundImagesOnSheetCount++;
          notFoundImagesOnSheet += `${file}\r\n`
          //console.log(`imagem '${file}' nao encontrada na planilha`);
        }
    };
    
    let notFoundNamesOnFolderCount = 0;
    let notFoundNamesOnFolder = '';

    for(const row of rows) {
      // Do whatever you want to do with the file
      let found = false;
      
      for(const file of files) {
        let name = file.replace(extension,''); 
        if(name == row[0].trim()) {
          found = true;
        }
      }

      if(!found) {
        notFoundNamesOnFolderCount++;
        notFoundNamesOnFolder += `${row[0].trim()}\r\n`;
        //console.log(`nome '${row[0].trim()}' nao encontrado na pasta de imagens`);
      }
  };

  console.log("Total de imagens que não estão na planilha: " + notFoundImagesOnSheetCount);
  console.log(notFoundImagesOnSheet);
  console.log("Total de nomes da planilha que não estão na pasta: " + notFoundNamesOnFolderCount);
  console.log(notFoundNamesOnFolder);
});