# 使用最新的长期维护版本node作为基础镜像
FROM node

ADD dist/ambiences.config.json /home/share/front/config/

# # 将当期目录下的文件拷贝到linux系统的app文件夹下
# COPY --from=build ./dist ./lib
FROM nginx

ADD dist /etc/nginx/html

ADD nginx/default.conf /etc/nginx/conf.d/default.conf

# 暴露docker容器的80端口
EXPOSE 80

# # 运行docker脚本命令 --net
# CMD [ "npm", "run", "build" ]
