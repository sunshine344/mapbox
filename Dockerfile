# 使用最新的长期维护版本node作为基础镜像
FROM node

# 工作目录
WORKDIR /

COPY . .

ADD package.json .

# 存在package-lock.json时启用
ADD package-lock.json .

RUN npm install

RUN npm run build:production

COPY dist/dist/ambiences.config.json /usr/share/config/ambiences.config.json

# # 将当期目录下的文件拷贝到linux系统的app文件夹下
# COPY --from=build ./dist ./lib
FROM nginx

COPY dist/dist/ /usr/share/nginx/html/frontend-template/

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# CMD docker run -t -d -p 8090:8090 --restart=always --name=frontend-template -v /usr/share/nginx/html/frontend-template/ambiences.config.json:/usr/share/config/ambiences.config.json frontend-template  

# 暴露docker容器的80端口
# EXPOSE 80

# # 运行docker脚本命令 --net
# CMD [ "npm", "run", "build" ]