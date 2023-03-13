import React from 'react';
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import XLSX from 'xlsx';
import NMButton from '../../NMButton';
import Resource from '../../../utils/resource';
const SignedUrlResource = Resource('get-signed-url');

export const ExportToCSV = ({ csvData, fileName }) => {
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';
  const zipFileExtension = '.zip';

  function export_data_and_img(inData, infilename) {
    var count = 0;
    var name = infilename.concat(zipFileExtension);
    var zip = new JSZip();

    let convObj = flattenConversationObject(inData);
    let listOfAttachments = convObj.filter(({ Attachments }) => {
      return Attachments;
    });
    convObj.forEach(item => {
      delete item['Attachments'];
    });

    const ws = XLSX.utils.json_to_sheet(convObj); //variable ws -> worksheet
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }; //variable wb -> workbook
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    zip.file(infilename.concat(fileExtension), data, { binary: true });

    if (listOfAttachments.length > 0) {
      listOfAttachments.forEach(function (attachementItem) {
        var fileExt = attachementItem.name.split('.').pop();
        SignedUrlResource.read({ s3Key: attachementItem.s3Key }).then(
          result => {
            const signedUrl = result.signedUrl;
            //console.log(signedUrl);
            JSZipUtils.getBinaryContent(signedUrl, function (err, data) {
              if (err) {
                //throw err;
                console.log(
                  'There was some issue with downloading the images for message id : ' +
                    attachementItem.MessageId
                );
              }
              zip.file(
                attachementItem.MessageId.concat('.').concat(fileExt),
                data,
                { binary: true }
              );
              count++;
              if (count === listOfAttachments.length) {
                zip.generateAsync({ type: 'blob' }).then(function (content) {
                  FileSaver.saveAs(content, name);
                });
              }
            });
          }
        );
      });
    } else {
      zip.generateAsync({ type: 'blob' }).then(function (content) {
        FileSaver.saveAs(content, name);
      });
    }
  }

  function flattenConversationObject(csvData) {
    const flattenList = [];

    csvData.conversation.Messages.forEach(item => {
      var isAddedToList = false;
      let attachments = item.Attachments;
      if (attachments != null && attachments.length > 0) {
        attachments.forEach(attachItem => {
          item['attachment'] = 'yes';
          item['s3Key'] = attachItem.s3Key;
          item['name'] = attachItem.name;
          flattenList.push(item);
        });
        isAddedToList = true;
      }
      if (!isAddedToList) {
        flattenList.push(item);
      }
    });
    return flattenList;
  }

  const exportToCSV = (csvData, fileName) => {
    fileName = csvData.conversation.ConversationId;
    //console.log(csvData);
    export_data_and_img(csvData, fileName);
  };

  return (
    <NMButton variant="red" onClick={e => exportToCSV(csvData, fileName)}>
      Export
    </NMButton>
  );
};
