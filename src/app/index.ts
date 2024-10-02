import express from 'express';
import multer from 'multer';
import { execFile } from 'child_process';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

// Certificar-se de que a pasta de upload ('tpm') existe
const uploadPath = path.resolve(__dirname, 'tpm');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Configurar armazenamento usando multer.diskStorage()
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  },
});

// Configurar multer com diskStorage e um filtro de tipo de arquivo
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024}, // Limite de 2MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo inválido.'));
    }
  },
});

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3005;

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Rota para aplicar marca d'água
app.post('/apply-watermark', upload.fields([
  { name: 'watermark', maxCount: 1 },
  { name: 'images', maxCount: 10 },
]), (req: any, res: any) => {
  console.log(`aaaaa`);
  
  if (!req.files || !('watermark' in req.files) || !('images' in req.files)) {
    return res.status(400).send('Arquivos de imagem ou marca d\'água não foram fornecidos.');
  }

  // Definindo os tipos para `watermarkFile` e `imagesFiles`
  const watermarkFile = (req.files['watermark'] as Express.Multer.File[])[0];
  const imagesFiles = req.files['images'] as Express.Multer.File[];

  // Caminho da imagem de marca d'água
  const watermarkPath = watermarkFile.path;

  // Pasta de entrada e saída temporárias
  const inputFolder = path.resolve(__dirname, 'tpm/images_input');
  const outputFolder = path.resolve(__dirname, 'tpm/images_output');

  // Criar as pastas de entrada e saída se não existirem
  if (!fs.existsSync(inputFolder)) fs.mkdirSync(inputFolder, { recursive: true });
  if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder, { recursive: true });

  // Mover arquivos de imagem para a pasta de entrada
  imagesFiles.forEach((file) => {
    const destPath = path.join(inputFolder, file.filename);
    try {
      fs.renameSync(file.path, destPath);
      console.log(`Arquivo movido para: ${destPath}`);
    } catch (error) {
      console.error(`Erro ao mover o arquivo ${file.path} para ${destPath}:`, error);
      return res.status(500).send('Erro ao mover os arquivos de imagem.');
    }
  });

  // Verificar a existência do arquivo da marca d'água antes de executar o Rust
  if (!fs.existsSync(watermarkPath)) {
    console.error(`Marca d'água não encontrada em: ${watermarkPath}`);
    return res.status(500).send('Erro ao processar a marca d\'água.');
  }

  // Caminho para o executável Rust
  const rustExecutable = path.resolve(__dirname, '../../../watermark-service/target/release/watermark-service');

  // Executar o programa Rust
  execFile(rustExecutable, [watermarkPath, inputFolder, outputFolder], (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao executar o serviço de marca d'água: ${error.message}`);
      return res.status(500).send(`Erro ao aplicar a marca d'água: ${stderr}`);
    }
  
    console.log(`Saída do programa Rust: ${stdout}`);
  
    // Listar os arquivos na pasta de saída
    fs.readdir(outputFolder, (err, files) => {
      if (err) {
        console.error(`Erro ao ler a pasta de saída: ${err.message}`);
        return res.status(500).send('Erro ao processar as imagens.');
      }
  
      // Verificar se há imagens na pasta de saída
      if (files.length === 0) {
        return res.status(500).send('Nenhuma imagem processada encontrada.');
      }
  
      // Pegar o primeiro arquivo da pasta de saída
      const outputFile = path.join(outputFolder, files[0]);
  
      // Enviar o arquivo processado de volta ao cliente
      res.sendFile(outputFile, (err) => {
        if (err) {
          console.error(`Erro ao enviar a imagem: ${err.message}`);
          return res.status(500).send('Erro ao enviar a imagem processada.');
        }
  
        console.log('Imagem enviada com sucesso.');
  
        // Remover arquivos temporários após o envio
        try {
          fs.rmSync(inputFolder, { recursive: true, force: true });
          fs.rmSync(outputFolder, { recursive: true, force: true });
          fs.unlinkSync(watermarkPath);
        } catch (removeError) {
          console.error('Erro ao remover arquivos temporários:', removeError);
        }
      });
    });
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
