use tonic::{transport::Server, Request, Response, Status};
use tonic_web::GrpcWebLayer;
use hello_world::greeter_server::{Greeter, GreeterServer};
use hello_world::{HelloReply, HelloRequest};
use tower_http::cors::{Any, CorsLayer};
use tower::ServiceBuilder;
use http::HeaderValue;

pub mod hello_world {
    tonic::include_proto!("helloworld");
}

#[derive(Debug, Default)]
pub struct MyGreeter {}

#[tonic::async_trait]
impl Greeter for MyGreeter {
    async fn say_hello(
        &self,
        request: Request<HelloRequest>,
    ) -> Result<Response<HelloReply>, Status> {
        println!("Got a request: {:?}", request);

        let reply = HelloReply {
            message: format!("Hello {}!", request.into_inner().name),
        };

        Ok(Response::new(reply))
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "0.0.0.0:50051".parse()?;
    let greeter = MyGreeter::default();

    println!("gRPC server listening on {}", addr);

    Server::builder()
        .accept_http1(true)
        .layer(
            ServiceBuilder::new()
                .layer(
                    CorsLayer::new()
                        .allow_origin(["http://localhost:3000".parse::<HeaderValue>()?, "http://localhost:8080".parse::<HeaderValue>()?])
                        .allow_headers(Any)
                        .allow_methods(Any)
                )
                .layer(GrpcWebLayer::new())
        )
        .add_service(GreeterServer::new(greeter))
        .serve(addr)
        .await?;

    Ok(())
}