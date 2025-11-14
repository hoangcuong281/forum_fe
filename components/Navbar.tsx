import Image from 'next/image'
import Link from 'next/link'
import { InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group"
import { Search } from "lucide-react"
const Navbar = () => {
    return ( 
        <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-[50px] lg:px-[100px] py-[10px] shadow-sm gap-4 md:gap-0">
            <Link href='/'>
                <Image
                    src="https://res.cloudinary.com/dqxeupx0u/image/upload/v1762483656/logo_defmcf.svg"
                    alt="TLU logo"
                    width={180}
                    height={38}
                    style={{ width: '150px', height: 'auto' }}
                    className="md:w-[180px] lg:w-[200px]"
                    priority
                    />
            </Link>
            
            <div className='w-full md:w-[300px] lg:w-[500px]'>
                <InputGroup>
                    <InputGroupInput placeholder="Câu hỏi của bạn là gì?" />
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                </InputGroup>
            </div>
            <div className="w-full md:w-auto text-center md:text-left">
                <a href="/login" className="inline-block px-4 py-2">Đăng nhập</a>
            </div>
        </div>
    );
}
 
export default Navbar;