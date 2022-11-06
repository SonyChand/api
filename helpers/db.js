const mysql = require('mysql2/promise');

const createConnection = async() => {
    return await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database:'db_si'
    });
}




const getReply = async (keyword, nomornya,) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT * FROM khs WHERE nim = ?', [keyword], 'AND status = "1"');
      
    if (rows.length > 0 && keyword.length === 8 && nomornya === rows[0].no_hp){
        // return rows[0].nama_ibu;
//         return(`*Data Ibu Hamil*

// *Nama Ibu:* ${rows[0].nama_ibu}
// *Umur Ibu:* ${rows[0].umur_ibu} tahun
// *Nama Suami:* ${rows[0].nama_suami}
// *Alamat:* ${rows[0].alamat}
// *Kehamilan ke:* ${rows[0].hamil_ke}
// *HPHT:* ${rows[0].hpht}
// *Kunjungan terakhir:* ke-${rows[0].ke}
//             `);
//     }else{
//         if(rows.length === 0 && keyword.length === 16){
//             return(`Data Ibu Hamil dengan NIK *`+keyword+`* tidak tersedia!!`);
//         }
//     }
//     return false;
        return(`*Kartu Hasil Studi*

*Nama:* ${rows[0].nama}
*NIM:* ${rows[0].nim}
*Nilai ASI:* ${rows[0].nilai_asi}
*Nilai KJDK:* ${rows[0].nilai_kjdk}
*Nilai PAI:* ${rows[0].nilai_pai}
*Nilai Statistika:* ${rows[0].nilai_statistika}
*Nilai MLTI:* ${rows[0].nilai_mlti}
*Nilai MatDis:* ${rows[0].nilai_md}
*Nilai KTI:* ${rows[0].nilai_kti}
            `);
    }else if(rows.length > 0 && keyword.length === 8 && nomornya !== rows[0].no_hp){
        return(`Kartu Hasil Studi dengan NIM *`+keyword+`* tidak bisa diakses oleh Nomor Whatsapp ini!!`);
    }else{
        if(rows.length === 0 && keyword.length === 8){
            return(`Kartu Hasil Studi dengan NIM *`+keyword+`* tidak tersedia!!`);
        }
    }
    return false;
}

module.exports = {
    createConnection,
    getReply
}