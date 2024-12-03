/* external import */
import {v2 as cloudinary} from 'cloudinary';

/* remove image from cloudinary */
async function remove(public_id: string): Promise<void> {
    await cloudinary.uploader.destroy(public_id, function (result) {
        // console.log(result);
    });
}

export default remove;