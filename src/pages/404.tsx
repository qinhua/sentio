import { PATH } from "@/constants/path";

const Page404 = () => {
  return (
    <div className="fixed z-1300 left-0 top-0 w-100vw h-100vh flex justify-start items-center p-10 bg-[#161C24]">
      <div>
        <h2 className="text-34px font-bold text-[#fff]">😨 Page Not Found</h2>
        <a
          className="flex justify-center items-center mt-6 h-40px px-4 text-[#ede8f9] bg-[#6624FF] rounded-[30px] hover:bg-[#824DFF] transition"
          href={PATH.doctorList}
        >
          Back to home
        </a>
      </div>
    </div>
  );
};

export default Page404;
