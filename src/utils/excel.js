// import XLSX from 'xlsx'

// export default function(filename, sheetName, data) {
//     filename = filename.endsWith('.xlsx') ? filename : filename + '.xlsx'
//     data = data || [[1,2,3],[true, false, null, 'sheetjs'],['foo','bar',new Date('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']]
//     var ws_name = sheetName
    
//     var wb = XLSX.utils.book_new(), ws = XLSX.utils.aoa_to_sheet(data)
    
//     /* add worksheet to workbook */
//     XLSX.utils.book_append_sheet(wb, ws, ws_name)

//     /* write workbook */
//     XLSX.writeFile(wb, filename)
// }