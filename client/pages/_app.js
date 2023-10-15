import 'bootstrap/dist/css/bootstrap.css'
import buildClient from '../api/build-client'
import Header from '../components/header'

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <>
      <Header currentUser={currentUser} />
      <div className='container'>
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </>
  )
}

AppComponent.getInitialProps = async (appContext) => {
  // console.log(appContext)

  //build-client.js (axios.create({}))
  const client = buildClient(appContext.ctx)
  const { data } = await client.get('/api/users/currentuser')

  let pageProps = {}
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    )
  }

  // console.log(appContext)
  // console.log(pageProps)
  // console.log(data)
  return {
    pageProps,
    // currentUser: data.currentUser,
    ...data,
  }
}

export default AppComponent
