import ContactForm from "@/components/contact-form/contact-form";
import Image from "next/image";
import Link from "next/link";

const Contact = () => {
    return (
        <div className="flex-1 container mx-auto mt-20 py-8 px-4 flex flex-col items-center justify-center">
            <Link href="/">
                <Image alt='logo'
                       className="cursor-pointer"
                       src='/assets/logos/ejaar_logo_v2.png' width={150} height={40}/>
            </Link>
            <div className="w-full">
                <ContactForm />
            </div>
        </div>
    )
}
export default Contact;
