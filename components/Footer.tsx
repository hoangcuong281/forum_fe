import { House } from "lucide-react"

const Footer = () => {
    return ( 
        <footer>
            <div className="flex flex-col lg:flex-row items-start justify-around px-20 py-10 gap-20 bg-(--main-blue)">
                <div className="flex items-start justify-center flex-col text-white">
                    <div className="flex items-start justify-between flex-row gap-2 font-bold">
                        <House/>
                        <span>ĐỊA CHỈ</span>
                    </div>
                    <p>Đường Nghiêm Xuân Yêm, Phường Định Công, Thành phố Hà Nội</p>
                </div>
                <div className="flex items-start justify-center text-white flex-col">
                    <span className="font-bold">THÔNG TIN LIÊN HỆ</span>
                    <p>Email: thanglong@gmail.com</p>
                    <p>Điện thoại: 1900 12 34 56 / 011 9999</p>
                    <p>Fax: 0123456789</p>
                </div>
            </div>
        </footer>
    );
}
 
export default Footer;