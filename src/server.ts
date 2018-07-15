import app from 'src';

interface AddressInfoWithPort {
  port: number;
}

const httpServer = app.listen(process.env.PORT || 3000, (error: Error) => {
  if (error) {
    console.error(error);
  } else {
    const address = httpServer.address() as AddressInfoWithPort;
    console.info(
      `==> 🌎 Listening on ${address.port}. Open up http://localhost:${
        address.port
      }/ in your browser.`,
    );
  }
});
