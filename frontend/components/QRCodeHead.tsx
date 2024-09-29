import Head from 'next/head'

export default function QRCodeHead() {
    return (
        <Head>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js" />
        </Head>
    )
}