package com.moa.service.user;

import java.util.List;
import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

import com.moa.common.exception.BusinessException;
import com.moa.common.exception.ErrorCode;
import com.moa.dao.user.UserDao;
import com.moa.dto.user.request.UserCreateRequest;

@Component
public class UserAddValidator {

	private static final Pattern PASSWORD_PATTERN = Pattern
			.compile("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*()])[A-Za-z\\d!@#$%^&*()]{8,20}$");

	private static final List<String> BAD_WORDS = List.of("fuck", "shit", "bitch", "asshole", "씨발", "시발", "좆", "병신",
			"썅", "새끼", "지랄", "닥쳐", "미친", "또라이", "보지", "자지", "개새끼", "ㅅㅂ", "ㅂㅅ", "ㅁㅊ", "ㅈㄴ");

	private final UserDao userDao;

	public UserAddValidator(UserDao userDao) {
		this.userDao = userDao;
	}

	/*
	 * ======================== 일반 회원가입 검증 ========================
	 */
	public void validateForSignup(UserCreateRequest request) {

		validatePasswordRule(request.getPassword());
		validatePasswordConfirm(request.getPassword(), request.getPasswordConfirm());

		validateNicknameCommon(request.getNickname());
		validateEmailDuplicate(request.getUserId());
		validateNicknameDuplicate(request.getNickname());
		validatePhoneDuplicate(request.getPhone());

		validateCi(request.getCi());
	}

	/*
	 * ======================== 소셜 회원가입 검증 ========================
	 */
	public void validateForSocialSignup(UserCreateRequest request) {

		if (request.getProvider() == null || request.getProvider().isBlank() || request.getProviderUserId() == null
				|| request.getProviderUserId().isBlank()) {
			throw new BusinessException(ErrorCode.VALIDATION_ERROR, "소셜 인증 정보가 올바르지 않습니다.");
		}

		validateNicknameCommon(request.getNickname());
		validateNicknameDuplicate(request.getNickname());

		if (request.getPhone() == null || request.getPhone().isBlank()) {
			throw new BusinessException(ErrorCode.VALIDATION_ERROR, "휴대폰 번호가 필요합니다.");
		}

		validateCi(request.getCi());
	}

	/*
	 * ======================== 공통 검증 로직 ========================
	 */
	private void validatePasswordRule(String password) {
		if (password == null || !PASSWORD_PATTERN.matcher(password).matches()) {
			throw new BusinessException(ErrorCode.VALIDATION_ERROR, "비밀번호 형식이 올바르지 않습니다.");
		}
	}

	private void validatePasswordConfirm(String password, String passwordConfirm) {
		if (password == null || passwordConfirm == null || !password.equals(passwordConfirm)) {
			throw new BusinessException(ErrorCode.VALIDATION_ERROR, "비밀번호가 일치하지 않습니다.");
		}
	}

	private void validateNicknameCommon(String nickname) {
		if (nickname == null || nickname.isBlank()) {
			throw new BusinessException(ErrorCode.VALIDATION_ERROR, "닉네임을 입력해 주세요.");
		}
		if (!nickname.matches("^[A-Za-z0-9가-힣]{2,10}$")) {
			throw new BusinessException(ErrorCode.VALIDATION_ERROR, "닉네임은 2~10자, 한글/영문/숫자만 가능합니다.");
		}

		String lower = nickname.toLowerCase();
		if (BAD_WORDS.stream().anyMatch(lower::contains)) {
			throw new BusinessException(ErrorCode.VALIDATION_ERROR, "닉네임에 사용할 수 없는 단어가 포함되어 있습니다.");
		}
	}

	private void validateEmailDuplicate(String userId) {
		if (userId == null || userId.isBlank()) {
			throw new BusinessException(ErrorCode.VALIDATION_ERROR, "아이디(이메일)를 입력해 주세요.");
		}
		if (userDao.existsByUserId(userId) > 0) {
			throw new BusinessException(ErrorCode.CONFLICT, "이미 사용중인 이메일입니다.");
		}
	}

	private void validateNicknameDuplicate(String nickname) {
		if (userDao.existsByNickname(nickname) > 0) {
			throw new BusinessException(ErrorCode.CONFLICT, "이미 사용중인 닉네임입니다.");
		}
	}

	private void validatePhoneDuplicate(String phone) {
		if (phone == null || phone.isBlank()) {
			throw new BusinessException(ErrorCode.VALIDATION_ERROR, "휴대폰 번호를 입력해 주세요.");
		}
		if (userDao.existsByPhone(phone) > 0) {
			throw new BusinessException(ErrorCode.DUPLICATED_PHONE);
		}
	}

	private void validateCi(String ci) {
		if (ci == null || ci.isBlank()) {
			throw new BusinessException(ErrorCode.VALIDATION_ERROR, "본인인증이 필요합니다.");
		}
	}
}
