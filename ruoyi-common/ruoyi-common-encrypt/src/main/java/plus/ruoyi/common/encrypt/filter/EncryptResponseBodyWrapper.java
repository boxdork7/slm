package plus.ruoyi.common.encrypt.filter;

import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.WriteListener;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletResponseWrapper;
import plus.ruoyi.common.encrypt.core.api.IApiCryptor;

import java.io.*;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

/**
 * 加密响应体包装器
 *
 * 继承HttpServletResponseWrapper，实现响应体的缓存和加密功能
 *
 * 工作原理：
 * 1. 拦截响应写入操作，将内容写入内存缓冲区
 * 2. 在过滤器中调用getEncryptContent方法获取加密后的内容
 * 3. 生成随机AES密钥加密响应体
 * 4. 用RSA公钥加密AES密钥放入响应头
 * 5. 返回加密后的响应内容
 *
 * @author Michelle.Chung
 */
public class EncryptResponseBodyWrapper extends HttpServletResponseWrapper {

    /**
     * 响应体统一字符集
     * <p>
     * 缓冲区写入、读出、告知客户端三处必须用同一个字符集。若写入/读出走 JVM 默认编码，
     * 而响应头声明 UTF-8，一旦默认编码不是 UTF-8（如 JDK 17 及以下的中文 Windows，
     * 或 JDK 18+ 以 -Dfile.encoding=COMPAT 启动时为 GBK），中文在加密前就已乱码，客户端解密后无法恢复。
     */
    private static final Charset RESPONSE_CHARSET = StandardCharsets.UTF_8;

    /**
     * 内存输出流，用于缓存响应内容
     */
    private final ByteArrayOutputStream byteArrayOutputStream;

    /**
     * 自定义的ServletOutputStream
     */
    private final ServletOutputStream servletOutputStream;

    /**
     * PrintWriter包装器
     */
    private final PrintWriter printWriter;

    /**
     * 构造函数，初始化缓冲区和包装器
     *
     * @param response 原始响应对象
     * @throws IOException 初始化失败时抛出
     */
    public EncryptResponseBodyWrapper(HttpServletResponse response) throws IOException {
        super(response);
        this.byteArrayOutputStream = new ByteArrayOutputStream();
        this.servletOutputStream = this.getOutputStream();
        this.printWriter = new PrintWriter(new OutputStreamWriter(byteArrayOutputStream, RESPONSE_CHARSET));
    }

    /**
     * 重写getWriter方法，返回自定义的PrintWriter
     */
    @Override
    public PrintWriter getWriter() {
        return printWriter;
    }

    /**
     * 刷新缓冲区
     */
    @Override
    public void flushBuffer() throws IOException {
        if (servletOutputStream != null) {
            servletOutputStream.flush();
        }
        if (printWriter != null) {
            printWriter.flush();
        }
    }

    /**
     * 重置缓冲区
     */
    @Override
    public void reset() {
        byteArrayOutputStream.reset();
    }

    /**
     * 获取响应数据的字节数组
     *
     * @return 响应内容的字节数组
     * @throws IOException 刷新缓冲区失败时抛出
     */
    public byte[] getResponseData() throws IOException {
        flushBuffer();
        return byteArrayOutputStream.toByteArray();
    }

    /**
     * 获取响应内容的字符串形式
     *
     * @return 响应内容字符串
     * @throws IOException 刷新缓冲区失败时抛出
     */
    public String getContent() throws IOException {
        flushBuffer();
        return byteArrayOutputStream.toString(RESPONSE_CHARSET);
    }

    /**
     * 获取加密后的响应内容
     *
     * 加密流程（具体算法由 {@link IApiCryptor} 决定，RSA+AES 或 SM2+SM4）：
     * 1. 生成本次响应专用的随机对称密钥
     * 2. 用服务端公钥加密对称密钥
     * 3. 将加密后的对称密钥放入响应头
     * 4. 用对称密钥加密响应体内容
     *
     * @param servletResponse 响应对象，用于设置响应头
     * @param apiCryptor 接口加解密器，按配置为 RSA+AES 或 SM2+SM4
     * @param headerFlag 响应头中存放加密密钥的标识
     * @return 加密后的响应内容
     * @throws IOException 获取响应内容失败时抛出
     */
    public String getEncryptContent(HttpServletResponse servletResponse, IApiCryptor apiCryptor, String headerFlag)
            throws IOException {

        // 1. 生成随机对称密钥
        String symmetricKey = apiCryptor.generateKey();

        // 2. 用服务端公钥加密对称密钥
        String encryptPassword = apiCryptor.encryptKey(symmetricKey);

        // 3. 设置CORS相关响应头和加密密钥头
        servletResponse.addHeader("Access-Control-Expose-Headers", headerFlag);
        servletResponse.setHeader("Access-Control-Allow-Origin", "*");
        servletResponse.setHeader("Access-Control-Allow-Methods", "*");
        servletResponse.setHeader(headerFlag, encryptPassword);
        servletResponse.setCharacterEncoding(RESPONSE_CHARSET.name());

        // 4. 获取原始响应内容
        String originalBody = this.getContent();

        // 5. 用对称密钥加密响应内容
        return apiCryptor.encryptBody(originalBody, symmetricKey);
    }

    /**
     * 重写getOutputStream方法，返回自定义的ServletOutputStream
     *
     * 该输出流将内容写入内存缓冲区而不是直接输出到客户端
     */
    @Override
    public ServletOutputStream getOutputStream() throws IOException {
        return new ServletOutputStream() {
            @Override
            public boolean isReady() {
                return false;
            }

            @Override
            public void setWriteListener(WriteListener writeListener) {

            }

            @Override
            public void write(int b) throws IOException {
                byteArrayOutputStream.write(b);
            }

            @Override
            public void write(byte[] b) throws IOException {
                byteArrayOutputStream.write(b);
            }

            @Override
            public void write(byte[] b, int off, int len) throws IOException {
                byteArrayOutputStream.write(b, off, len);
            }
        };
    }
}
