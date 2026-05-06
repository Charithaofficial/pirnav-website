FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src

COPY Pirnav.API.sln ./
COPY Pirnav.API/Pirnav.API.csproj Pirnav.API/
RUN dotnet restore Pirnav.API.sln

COPY Pirnav.API/ Pirnav.API/
RUN dotnet publish Pirnav.API/Pirnav.API.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080

COPY --from=build /app/publish .

RUN mkdir -p /app/wwwroot/resumes /app/wwwroot/uploads

EXPOSE 8080

ENTRYPOINT ["dotnet", "Pirnav.API.dll"]
