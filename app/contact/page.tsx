import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/contact-form/contact-form";

const Contact = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center">
            <div className="bg-ejaar-beige flex flex-col items-center flex-1 py-12 sm:px-6 lg:px-8">
                <div className="my-auto w-full">
                    <div className="flex justify-center">
                        <Link href="/" className="flex items-center">
                            <img alt='logo' src='/assets/logos/ejaar_logo_v4.svg' width={300} />
                        </Link>
                    </div>
                    <div className="mt-8 min-w-[36rem]">
                        <ContactForm />
                    </div>
                </div>
            </div>
            <div className="bg-ejaar-700 py-12 sm:px-6 lg:px-8 max-h-[200px]"></div>
        </div>
    )
}
export default Contact;
