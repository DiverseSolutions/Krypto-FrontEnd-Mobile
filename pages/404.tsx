export default function Custom404() {
    return (
        <div className="flex flex-col items-center justify-center my-auto dark:text-white w-11/12 mx-auto">
            <div className="flex items-center justify-center text-[8rem] font-bold" style={{ letterSpacing: "-1.5rem" }}>
                <h1 className="">4</h1>
                <span className="text-[10rem] z-10">😪</span>
                <h1>4</h1>
            </div>
            <h3 className="font-semibold text-2xl">ӨӨ! ХУУДАС ОЛДСОНГҮЙ</h3>
            <p className="text-center text-black dark:text-brand-grey-110 text-opacity-70 my-4 text-sm">
                Уучлаарай, таны хайж буй хуудас олдсонгүй.
                Нэр өөрчлөгдсөн эсвэл түр ашиглах боломжгүй
            </p>
            <div onClick={() => window.location.href = '/'} className="bg-gray-200 dark:bg-brand-dark-400 hover:bg-gray-300 py-2 px-6 rounded-md font-medium cursor-pointer text-sm">
                <p>Нүүр хуудас руу буцах</p>
            </div>
        </div>
    )
}