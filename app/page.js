import { getBodyHTML } from '@/lib/getHtml'

export default function Home() {
  const bodyHTML = getBodyHTML()
  
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: bodyHTML }} />
      <script src="/script.js" async></script>
    </>
  )
}
