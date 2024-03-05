var express = require('express');

var PDFDocument = require('pdfkit');
var pdfkitAddPlaceholder = require('@signpdf/placeholder-pdfkit010').pdfkitAddPlaceholder;

const fs = require('fs')
var path = require('path');
var plainAddPlaceholder = require('@signpdf/placeholder-plain').plainAddPlaceholder
var signpdf = require('@signpdf/signpdf').default;
var P12Signer = require('@signpdf/signer-p12').P12Signer;

class PdfGenerator {

    static async generatePdf(req, res){
        var myDoc = new PDFDocument({bufferPages: true});

        let buffers = [];
        myDoc.on('data', buffers.push.bind(buffers));
        myDoc.on('end', () => {

            let pdfData = Buffer.concat(buffers);
            res.writeHead(200, {
            'Content-Length': Buffer.byteLength(pdfData),
            'Content-Type': 'application/pdf',
            'Content-disposition': 'attachment;filename=test.pdf',})
            .end(pdfData);

        });

        myDoc.font('Times-Roman')
            .fontSize(12)
            .text(`this is a test text`);
        myDoc.end();
    }

    static async test2(req, res){

        try {
            // Start a PDFKit document
            var pdf = new PDFDocument({
                autoFirstPage: false,
                size: 'A4',
                layout: 'portrait',
                bufferPages: true,
            });
            pdf.info.CreationDate = '';

            // At the end we want to convert the PDFKit to a string/Buffer and store it in a file.
            // Here is how this is going to happen:
            var pdfReady = new Promise(function (resolve) {
                // Collect the ouput PDF
                // and, when done, resolve with it stored in a Buffer
                var pdfChunks = [];
                pdf.on('data', function (data) {
                    pdfChunks.push(data);
                });
                pdf.on('end', function () {
                    resolve(Buffer.concat(pdfChunks));
                });
            });

            // Add some content to the page(s)
            pdf
                .addPage()
                .fillColor('#333')
                .fontSize(25)
                .moveDown()
                .text('@signpdf')
                .save();

            // Here comes the signing. We need to add the placeholder so that we can later sign.
            var refs = pdfkitAddPlaceholder({
                pdf: pdf,
                pdfBuffer: Buffer.from([pdf]), // FIXME: This shouldn't be needed.
                reason: 'Showing off.',
                contactInfo: 'signpdf@example.com',
                name: 'Sign PDF',
                location: 'The digital world.',
            });

            // `refs` here contains PDFReference objects to signature, form and widget.
            // PDFKit doesn't know much about them, so it won't .end() them. We need to do that for it.
            Object.keys(refs).forEach(function (key) {
                refs[key].end()
            });

            // Once we .end the PDFDocument, the `pdfReady` Promise will resolve with
            // the Buffer of a PDF that has a placeholder for signature that we need.
            // Other that we will also need a certificate
            // certificate.p12 is the certificate that is going to be used to sign
            var certificatePath = path.join(__dirname, '../assets/key.p12');
            var certificateBuffer = fs.readFileSync(certificatePath);
            var signer = new P12Signer(certificateBuffer, { passphrase: "paranoid142010" });
            
            // Once the PDF is ready we need to sign it and eventually store it on disc.
            pdfReady
                .then(function () {
                    return signpdf.sign(pdfWithPlaceholder, signer);
                })
                .then(function (signedPdf) {
                    var targetPath = path.join(__dirname, '../assets/pdfkit010.pdf');
                    fs.writeFileSync(targetPath, signedPdf);
                });

            // Finally end the PDFDocument stream.
            pdf.end();
            // This has just triggered the `pdfReady` Promise to be resolved.
            res.status(200).json({status: 'Ok'});
            
        } catch (error) {
            console.log(error);
            console.log(error.lineNumber)
        }

        
    }

    static async test(req, res){
        // contributing.pdf is the file that is going to be signed
        var sourcePath = path.join(__dirname, '../assets/test2.pdf');
        var pdfBuffer = fs.readFileSync(sourcePath);
        
        // certificate.p12 is the certificate that is going to be used to sign
        var certificatePath = path.join(__dirname, '../assets/key.p12');
        var certificateBuffer = fs.readFileSync(certificatePath);
        var signer = new P12Signer(certificateBuffer, { passphrase: "paranoid142010" });

        // The PDF needs to have a placeholder for a signature to be signed.
        var pdfWithPlaceholder = plainAddPlaceholder({
            pdfBuffer: pdfBuffer,
            reason: 'The user is decalaring consent through JavaScript.',
            contactInfo: 'signpdf@example.com',
            name: 'John Doe',
            location: 'Free Text Str., Free World',
        });

        // pdfWithPlaceholder is now a modified buffer that is ready to be signed.
        signpdf
            .sign(pdfWithPlaceholder, signer)
            .then(function (signedPdf) {
                // signedPdf is a Buffer of an electronically signed PDF. Store it.
                var targetPath = path.join(__dirname, '/../assets/javascript.pdf');
                fs.writeFileSync(targetPath, signedPdf);
        })
        
        res.status(200).json({status: 'Ok'});
    }
}

module.exports = PdfGenerator;