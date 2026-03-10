// ** React router
import {Link} from "react-router-dom";

// ** Helmet
import {Helmet} from "react-helmet-async";

// ** Component
import Button from "@/components/common/Button";

// ** Config
import {CONFIG_ROUTER} from "@/configs/router";

const Forbidden = () => {
    return (
       <>
           <Helmet>
               <title>403 - Không có quyền truy cập | ZTruyen Admin</title>
               <meta name="description" content="Bạn không có quyền truy cập vào trang này" />
               <meta name="robots" content="noindex, nofollow" />
           </Helmet>

           <div className='flex h-screen justify-center items-center'>
               <div className='text-center'>
                   <figure className='m-auto w-40 lg:w-60'>
                       <img src="/403.svg" alt="forbidden" loading='lazy' decoding='async' width={300} height={200} className='w-full'/>
                   </figure>
                   <div className='mt-6 space-y-4 lg:mt-8'>
                       <h1 className='text-3xl font-bold tracking-tight lg:text-5xl'>Không có sự cho phép</h1>
                       <p className='text-muted-foreground'>Bạn không có quyền truy cập vào trang này.</p>
                   </div>
                   <div className='mt-6 lg:mt-8'>
                       <Link to={CONFIG_ROUTER.LOGIN}>
                           <Button>Về trang đăng nhập</Button>
                       </Link>
                   </div>
               </div>
           </div>
       </>
    )
}

export default Forbidden