import { Card, CardContent } from "./ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";

export default function ImageCarousel() {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="relative w-3/4 max-w-3xl pt-4"
    >
      <CarouselContent>
        <CarouselItem key={1} className="md:basis-1/2 lg:basis-1/2">
          <div className="p-1">
            <Card className="flex aspect-video">
              <CardContent className="flex items-center justify-center p-1">
                <img
                  src="/img/kartoffel-hänger.jpeg"
                  alt="Kartoffeln"
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
        <CarouselItem key={2} className="md:basis-1/2 lg:basis-1/2">
          <div className="p-1">
            <Card className="flex aspect-video">
              <CardContent className="flex items-center justify-center p-1">
                <img
                  src="/img/erdbeer-körbe.jpeg"
                  alt="Kartoffeln"
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
        <CarouselItem key={3} className="md:basis-1/2 lg:basis-1/2">
          <div className="p-1">
            <Card className="flex aspect-video">
              <CardContent className="flex items-center justify-center p-1">
                <img
                  src="/img/herbst.jpeg"
                  alt="Herbstliche Blätter"
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
        <CarouselItem key={4} className="md:basis-1/2 lg:basis-1/2">
          <div className="p-1">
            <Card className="flex aspect-video">
              <CardContent className="flex items-center justify-center p-1">
                <img
                  src="/img/garten-nebel.jpeg"
                  alt="Nebliger Garten"
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
        <CarouselItem key={5} className="md:basis-1/2 lg:basis-1/2">
          <div className="p-1">
            <Card className="flex aspect-video">
              <CardContent className="flex items-center justify-center p-1">
                <img
                  src="/img/schnee-feld.jpeg"
                  alt="Feld im Schnee"
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious className="text-black shadow-l" />
      <CarouselNext className="text-black" />
    </Carousel>
  );
}
